import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../AuthContext";
import { loginSchema, type LoginSchemaType } from "../schemas";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";

const LoginPage = () => {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    try {
      await login(data);
      navigate("/");
    } catch (error) {
      console.error(error); // Log for debugging
      setError("root", {
        message: "Invalid email or password", // Simplified error handling
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
          {t("nav.login")}
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
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
            {t("nav.login")}
          </Button>

          <div
            style={{
              textAlign: "center",
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              marginTop: "1rem",
            }}
          >
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--accent-primary)" }}>
              {t("nav.register")}
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
