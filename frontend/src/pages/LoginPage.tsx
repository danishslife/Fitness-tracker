import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { login, register as registerUser } from "../api/AuthService";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = loginSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters."),
});

type LoginFormData = z.infer<typeof loginSchema>;

type LoginPageProps = {
  onSuccess: () => void;
};

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(mode === "register" ? registerSchema : loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      if (mode === "register") {
        await registerUser(data.email, data.password);
      } else {
        await login(data.email, data.password);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 400, mx: "auto", mt: 8, textAlign: "left" }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        {mode === "login" ? "Log in" : "Create account"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        autoComplete="email"
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register("email")}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register("password")}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={isSubmitting}
      >
        {mode === "login" ? "Log in" : "Register"}
      </Button>

      <Button
        type="button"
        fullWidth
        sx={{ mt: 1 }}
        onClick={() => {
          setError(null);
          setMode(mode === "login" ? "register" : "login");
        }}
      >
        {mode === "login"
          ? "Need an account? Register"
          : "Already have an account? Log in"}
      </Button>
    </Box>
  );
}
