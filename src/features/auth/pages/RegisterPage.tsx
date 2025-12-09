import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../AuthContext";
import { registerSchema, type RegisterSchemaType } from "../schemas";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";

const RegisterPage = () => {
  const { t } = useTranslation();
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    try {
      await registerUser(data);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("root", {
        message: "Registration failed. Try using a different email.",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
      }}
    >
      <Card padding="lg" style={{ width: "100%", maxWidth: "400px" }}>
        <h1
          className="text-gradient"
          style={{ textAlign: "center", marginBottom: "1.5rem" }}
        >
          {t("nav.register")}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <Input
            label="Username"
            placeholder="Gamer123"
            {...register("username")}
            error={errors.username?.message}
          />

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••"
            {...register("password")}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          {errors.root && (
            <div
              style={{
                color: "var(--error)",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              {errors.root.message}
            </div>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            style={{ marginTop: "0.5rem" }}
          >
            {t("nav.register")}
          </Button>

          <div
            style={{
              textAlign: "center",
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              marginTop: "1rem",
            }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent-primary)" }}>
              {t("nav.login")}
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RegisterPage;
