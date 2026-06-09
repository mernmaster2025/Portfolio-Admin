"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Message should be at least 10 characters"),
});
type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * Demo contact form — validates with React Hook Form + Zod and simulates a
 * submit. The exported site ships the same component; wire it to an API route
 * or form service of your choice.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  const onSubmit = async (values: ContactFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    void values;
    setSent(true);
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2}>
        {sent && <Alert severity="success">Thanks! Your message has been sent.</Alert>}
        <TextField
          label="Name"
          fullWidth
          {...register("name")}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <TextField
          label="Message"
          fullWidth
          multiline
          minRows={4}
          {...register("message")}
          error={!!errors.message}
          helperText={errors.message?.message}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          endIcon={<SendIcon />}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Send message"}
        </Button>
      </Stack>
    </Box>
  );
}
