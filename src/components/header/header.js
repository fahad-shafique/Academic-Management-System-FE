import { Link, NavLink } from 'react-router-dom';
import HeaderLink from './header-link';
import useAxios from '../../hooks/use-axios';
import AuthContext from "../../context/AuthContext";
import {useContext} from "react";

const NAV_ITEMS = [
  { path: '', name: 'Clubs' },
  { path: 'events', name: 'Events' },
];

const LOGOUT_URL = "/auth/logout";

const Headers = () => {

  const { user, authTokens } = useContext(AuthContext);

  const axios = useAxios();

  return (
    <nav className="flex flex-col justify-between py-12 md:flex-row">
      <Link to={"/"} className="self-start md:self-auto">
        <h1 className="text-3xl font-bold">{
          user ? user.full_name ?? user.email : "Events all Everywhere"
        }</h1>
      </Link>
      <div className="my-6 flex space-x-8 self-center md:my-0 md:self-auto">
        <ul className="flex space-x-8">
          {NAV_ITEMS.map((item) => (
            <li
              key={item.path}
              className="text-secondary hover:text-primary whitespace-nowrap py-2 text-lg font-medium transition-all duration-300"
            >
              <HeaderLink to={item.path}>{item.name}</HeaderLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Headers;
