import { memo, useEffect, useMemo, useState } from "react";
import { Modal } from "./Modal";
import { Search } from "./Search";
import { Person } from "./Person";
import { link } from "@/lib/link";

export const ModalNewChat = memo(
  ({
    show,
    onClose,
    onStartChat,
  }: ModalProps<{ onStartChat: (person: Person) => void }>) => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [loadingPersons, setLoadingPersons] = useState(false);
    const [modalSearch, setModalSearch] = useState("");

    const persons_filtered = useMemo(() => {
      const filtered =
        modalSearch == ""
          ? persons
          : persons.filter((p) =>
              p.name.toLowerCase().includes(modalSearch.toLowerCase())
            );

      return filtered.sort((a, b) => {
        if (b.isOnline && !a.isOnline) {
          return -1;
        } else if (!b.isOnline && a.isOnline) {
          return 0;
        }

        const timea = a.lastSeen
          ? new Date(a.lastSeen).getTime()
          : Number.MIN_VALUE;
        const timeb = b.lastSeen
          ? new Date(b.lastSeen).getTime()
          : Number.MIN_VALUE;
        return timeb - timea;
      });
    }, [persons, modalSearch]);

    useEffect(() => {
      if (show) {
        setModalSearch("");
        setLoadingPersons(true);
        fetch(link("/api/data/person-all"))
          .then((res) => res.json())
          .then((data) => {
            setPersons(data);
            setLoadingPersons(false);
          });
      }
    }, [show]);

    return (
      <Modal
        show={show}
        onClose={onClose}
        header="Start Chat with"
        head={
          <>
            <div className="pb-2">
              <Search value={modalSearch} onChange={(v) => setModalSearch(v)} />
            </div>
            {loadingPersons && (
              <div className="p-px text-center bg-green-400 text-sm">
                Refreshing...
              </div>
            )}
          </>
        }
      >
        <div className="pb-4">
          {persons_filtered.map((person) => (
            <Person
              user={person}
              key={person.id}
              onSelect={() => onStartChat(person)}
            />
          ))}
        </div>
      </Modal>
    );
  },
  (p, n) => p.show == n.show
);
ModalNewChat.displayName = "ModalNewChat";
