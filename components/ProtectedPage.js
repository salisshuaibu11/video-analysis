import React, { useState } from "react";
import { Container, Button, Input, Stack } from "@chakra-ui/react";
import Header from "./Header";

export default function ProtectedPage({ children }) {
  const isLoggedIn = false;
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  return (
    <>
      <Header />
      {!isLoggedIn ? (
        <Container>
          <Stack spacing={3} marginBottom="1rem">
            <Input
              onChange={(e) => setAppId(e.target.value)}
              value={appId}
              placeholder="appId"
              size="md"
            />
            <Input
              onChange={(e) => setAppSecret(e.target.value)}
              value={appSecret}
              placeholder="appSecret"
              size="md"
            />
          </Stack>
          <Button>Login</Button>
        </Container>
      ) : children}
    </>
  )
}
