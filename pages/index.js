import {useState, useEffect, useRef} from "react";
import {
  Input,
  InputGroup,
  Container,
  Box,
  AspectRatio,
  SimpleGrid,
  Divider,
  Button,
  Heading,
  Badge,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";

import Head from 'next/head'
import Header from "../components/Header";
import ProtectedPage from "../components/ProtectedPage";
import { useAuth, useInterval } from "../hooks";

export default function Home() {
  const [file, setFile] = useState("");
  const [videoSrc, setVideoSrc] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("not started");
  const [messages, setMessages] = useState([]);

  const videoRef = useRef(null);
  const {token} = useAuth();

  const getTranscripts = () => {
    fetch(`https://api.symbl.ai/v1/conversations/${conversationId}/messages`, {
      method: 'GET',
      headers: {
        'x-api-key': token,
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    })
    .then((rawResult) => rawResult.json())
    .then((result) => setMessages(result.messages));
  }

  useEffect(() => {
    if (status === "completed") {
      getTranscripts();
    }
  }, [status])

  console.log(messages);

  const submitFileForProcessing = (file) => {
    fetch("https://api.symbl.ai/v1/process/video", {
      method: "POST",
      headers: {
        'x-api-key': token,
        'Content-Type': 'video/mp4'
      },
      body: file,
      json: true
    })
    .then((rawResult) => rawResult.json())
    .then((result) => {
      console.log(result);
      setConversationId(result.conversationId);
      setJobId(result.jobId);
    })
  }

  useInterval(() => {
    fetch(`https://api.symbl.ai/v1/job/${jobId}`, {
      method: "GET",
      headers: {
        'x-api-key': token,
      }
    })
    .then((rawResult) => rawResult.json())
    .then((result) => setStatus(result.status));
  }, 1000, status === 'completed' || !jobId);

  useEffect(() => {
    const src = URL.createObjectURL(new Blob([file], {type: "video/mp4"}));
    setVideoSrc(src);
  }, [file]);
  return (
    <ProtectedPage>
      <Container maxWidth="1200px">
        <Box marginBottom="1rem">
          <InputGroup marginBottom="2rem">
            <Input
              type="file"
              id="input"
              accept="video/*"
              ref={videoRef}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </InputGroup>
          <Box bg="lightgrey" marginBottom="1rem">
            <AspectRatio maxH="100%" ratio={16/9}>
              <video id="video-summary" controls src={videoSrc}/>
            </AspectRatio>
          </Box>
          <Button colorScheme="teal" onClick={() => submitFileForProcessing(file)}>Send for proccessing</Button>
        </Box>
        <Divider orientation="horizontal" />
        <Heading>Proccessing Data</Heading>
        <SimpleGrid columns={2} spacingX="40px" spacingY="20px" marginTop="1rem">
          <Box boxShadow="dark-lg" p="6" rounded="md" bg="white" height="80px">
            <Container margin="1rem">
              <Heading as="h4" size="md">
                Transcript pulled from Conversation API
              </Heading>
              <List spacing={3} margin="2rem">
                {messages.map((message) => (
                  <ListItem key={message.id}>
                    <Container>
                      <Text fontSize="lg">{message.text}</Text>
                      {/*<Badge colorScheme="green">
                        {`${new Date(message.startTime).toDateString()} ${new Date(message.startTime).toTimeString()}`}
                      </Badge>
                      */}
                    </Container>
                  </ListItem>
                ))}
              </List>
            </Container>
          </Box>
        </SimpleGrid>
      </Container>
    </ProtectedPage>
  )
}
