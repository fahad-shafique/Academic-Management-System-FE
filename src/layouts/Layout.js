import React, {useContext} from 'react';
import Headers from '../components/header/header';
import AuthContext from "../context/AuthContext";
import ScrollUpButton from '../components/scroll-up-button';

const Layout = (props) => {
  const { authTokens } = useContext(AuthContext);;
  return (
    <React.Fragment>
      <Headers/>
      <main>
        {!authTokens && <React.Fragment>
        </React.Fragment>}
        {props.children}
      </main>
      <div className="fixed bottom-12 right-10">
        <ScrollUpButton />
      </div>
    </React.Fragment>
  )
}

export default Layout;
