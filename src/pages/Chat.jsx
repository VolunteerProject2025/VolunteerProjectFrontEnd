import { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AuthContext } from '../context/AuthContext';

import ChatList from "../components/ChatList";
import ChatBox from "../components/ChatBox";

export function Chat() {
    const { user } = useContext(AuthContext);
    
    return (
        <Container fluid className="py-5" style={{ backgroundColor: "#eee" }}>
            <Row>
                <Col md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                    <ChatList />
                </Col>

                <Col md="6" lg="7" xl="8">
                    <ChatBox />
                </Col>
            </Row>
        </Container>
    );
}

export default Chat;