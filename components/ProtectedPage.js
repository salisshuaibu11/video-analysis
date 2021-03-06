import React, { useState } from "react";
import { Container, Button, Input, Stack } from "@chakra-ui/react";
import Header from "./Header";
import { useAuth } from "../hooks";

export default function ProtectedPage({ children }) {
  const {token, setToken} = useAuth("");
  const [appId, setAppId] = useState("");
  const [appSecret, setAppSecret] = useState("");
  const isLoggedIn = token;

  async function loginToSymbl() {
    const response = await fetch('https://api.symbl.ai/oauth2/token:generate', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        type: "application",
        appId,
        appSecret
      }),
    })
    const json = await response.json();
    setToken(json.accessToken);
  }
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
          <Button onClick={() => loginToSymbl()}>Login</Button>
        </Container>
      ) : children}
    </>
  )
}
