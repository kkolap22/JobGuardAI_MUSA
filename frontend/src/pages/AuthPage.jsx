import { Link, useSearchParams } from "react-router-dom";

import Layout from "../components/layout/Layout";
import Login from "./Login";
import Signup from "./Signup";

export default function AuthPage({ mode }) {
  const [params] = useSearchParams();

  const currentMode =
    mode ||
    params.get("mode") ||
    "login";

  const isSignup = currentMode === "signup";

  return (
    <Layout>
      <section className="mx-auto flex min-h-[75vh] max-w-md items-center px-5 py-12">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eafff1] text-[#08ad50]">
              <span className="text-xl font-black">
                J
              </span>
            </div>

            <h1 className="mt-5 font-display text-3xl font-bold">
              {isSignup
                ? "Create your account"
                : "Welcome back"}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {isSignup
                ? "Create your JobGuard AI account to start scanning jobs."
                : "Sign in to continue to JobGuard AI."}
            </p>
          </div>

          <div className="mt-8">
            {isSignup ? <Signup /> : <Login />}
          </div>

          <div className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#078e42] hover:underline"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-[#078e42] hover:underline"
                >
                  Create one
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}