import React, { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(false);

    if (!name.trim() || !email.trim() || !message.trim()) return;

    // Frontend demo only (later we can POST to your backend)
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3, mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
        Contact
      </Typography>
      <Typography sx={{ opacity: 0.8, mb: 2 }}>
        Send feedback or report an issue.
      </Typography>

      {sent ? <Alert severity="success" sx={{ mb: 2 }}>Message sent ✅ (demo)</Alert> : null}

      <form onSubmit={submit}>
        <Stack spacing={2}>
          <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            multiline
            minRows={5}
          />
          <Button type="submit" variant="contained" sx={{ fontWeight: 800 }}>
            Send
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
