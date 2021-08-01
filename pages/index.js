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
} from "@chakra-ui/react";

import Head from 'next/head'
import Header from "../components/Header";
import ProtectedPage from "../components/ProtectedPage";

export default function Home() {
  const [file, setFile] = useState("");
  const [videoSrc, setVideoSrc] = useState("");

  const videoRef = useRef(null);

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
          <Button colorScheme="teal" onClick={() => console.log("Submit file for proccessing")}>Send for proccessing</Button>
        </Box>
        <Divider orientation="horizontal" />
        <Heading>Proccessing Data</Heading>
        <SimpleGrid columns={2} spacingX="40px" spacingY="20px" marginTop="1rem">
          <Box boxShadow="dark-lg" p="6" rounded="md" bg="white" height="80px">
            <Container margin="1rem">
              <Heading as="h4" size="md">
                Transcript pulled from Conversation API
              </Heading>
            </Container>
          </Box>
        </SimpleGrid>
      </Container>
    </ProtectedPage>
  )
}
