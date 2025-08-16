import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";

const AppNav = () => {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="Cities">Cities</NavLink>
        </li>
        <li>
          <NavLink to="Countries">Countries</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AppNav;
