import { Header } from '../../components/Header/Header.jsx';
import { AddressBook } from '../../components/AddressBook/AddressBook.jsx';
import { ProfileIcon } from '../../components/Icons/ProfileIcon.jsx';
import { ProfileField } from './ProfileField.jsx';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  return (
    <>
      <title>PigeonExpress — personal info</title>
      <Header action="back" />

      <main className={styles.profile}>
        <h1 className="visually-hidden">Personal info</h1>

        <div className={styles.avatar}>
          <ProfileIcon className={styles.avatarIcon} />
        </div>

        <ProfileField field="name" label="Name" autoComplete="given-name" />
        <ProfileField field="surname" label="Surname" autoComplete="family-name" />

        <AddressBook kind="sender" legend="Sender’s adresses" removable />
        <AddressBook kind="receiver" legend="Recievers’ adresses" removable />
      </main>
    </>
  );
}
