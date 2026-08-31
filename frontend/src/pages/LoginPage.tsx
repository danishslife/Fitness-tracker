import { useState } from "react";
import "../styles/loginPage.css";
import { useForm, type Resolver } from "react-hook-form";
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
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

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
  } = useForm<RegisterFormData>({
    resolver: zodResolver(
      mode === "register" ? registerSchema : loginSchema,
    ) as unknown as Resolver<RegisterFormData>,
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      if (mode === "register") {
        await registerUser(
          data.email,
          data.password,
          data.firstName,
          data.lastName,
        );
      } else {
        await login(data.email, data.password);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div className="parent">
      <Box className="Box" component="form" onSubmit={handleSubmit(onSubmit)}>
        <Typography
          className="header"
          variant="h5"
          sx={{ mb: 2, textAlign: "center", fontSize: 36, fontWeight: 500 }}
        >
          {mode === "login" ? "Login" : "Create an account"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {mode === "register" && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="First name"
              margin="normal"
              autoComplete="given-name"
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  // borderRadius: "40px",
                  color: "#fff", // typed text color
                  "& fieldset": {
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    border: "2px solid rgba(255, 255, 255, 0.4)",
                  },
                  "&.Mui-focused fieldset": {
                    border: "2px solid #fff",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#fff", // floating label
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#fff", // label when focused
                },
              }}
              {...register("firstName")}
            ></TextField>
            <TextField
              label="Last Name"
              margin="normal"
              autoComplete="family-name"
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
              sx={{
                "& .MuiOutlinedInput-root": {
                  // borderRadius: "40px",
                  color: "#fff", // typed text color
                  "& fieldset": {
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                  },
                  "&:hover fieldset": {
                    border: "2px solid rgba(255, 255, 255, 0.4)",
                  },
                  "&.Mui-focused fieldset": {
                    border: "2px solid #fff",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#fff", // floating label
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#fff", // label when focused
                },
              }}
              {...register("lastName")}
            />
          </Box>
        )}

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{
            "& .MuiOutlinedInput-root": {
              // borderRadius: "40px",
              color: "#fff", // typed text color
              "& fieldset": {
                border: "2px solid rgba(255, 255, 255, 0.2)",
              },
              "&:hover fieldset": {
                border: "2px solid rgba(255, 255, 255, 0.4)",
              },
              "&.Mui-focused fieldset": {
                border: "2px solid #fff",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#fff", // floating label
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#fff", // label when focused
            },
          }}
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
          sx={{
            "& .MuiOutlinedInput-root": {
              // borderRadius: "40px",
              color: "#fff", // typed text color
              "& fieldset": {
                border: "2px solid rgba(255, 255, 255, 0.2)",
              },
              "&:hover fieldset": {
                border: "2px solid rgba(255, 255, 255, 0.4)",
              },
              "&.Mui-focused fieldset": {
                border: "2px solid #fff",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#fff", // floating label
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#fff", // label when focused
            },
          }}
          {...register("password")}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            bgcolor: "#fff",
            color: "#000",
            // borderRadius: "40px",
            "&:hover": {
              bgcolor: "#e0e0e0",
            },
          }}
          disabled={isSubmitting}
        >
          {mode === "login" ? "Login" : "Register"}
        </Button>

        <Button
          type="button"
          fullWidth
          sx={{
            mt: 1,
            color: "#fff",
          }}
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
    </div>
  );
}
