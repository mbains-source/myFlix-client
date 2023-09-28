import { createRoot } from 'react-dom/client';
import { MainView } from "./components/main-view/main-view";
import Container from 'react-bootstrap/Container';

//import statement to indicate need to bundle './index.scss'
import "./index.scss";

//main component (will eventually use all the others)
const MyFlixApplication = () => {
    return (
        <Container>
            <MainView />
        </Container>
    );
};

//finds root of app
const container = document.querySelector("#root");
const root = createRoot(container);

//tells React to render app in root DOM element
root.render(<MyFlixApplication/>);