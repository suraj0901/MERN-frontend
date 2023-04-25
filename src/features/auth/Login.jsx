import { useEffect, useRef, useState } from "react";
import { setCredential } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import usePersist from "../../hooks/usePersist";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredential({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (err) {
      let error = err.data?.message;
      if (err.status === 400) error = "Missing Username or Password";
      if (err.status === 401) error = "Unauthorized";
      if (!err.status) error = "No Server Response";
      setErrMsg(error);
      errRef.current.focus();
    }
  };
  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? "errmsg" : "offScreen";

  if (isLoading) return <p>Loading...</p>;

  const content = (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>
        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            className="form__input"
            id="username"
            name="username"
            ref={userRef}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />
          <label htmlFor="pssword">Pssword:</label>
          <input
            type="password"
            className="form__input"
            id="pssword"
            onChange={handlePwdInput}
            autoComplete="off"
            required
          />
          <button className="form__submit-button">Sign In</button>

          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              id="persist"
              className="form__checkbox"
              onChange={handleToggle}
              checked={persist}
            />
            Trust This Device
          </label>
        </form>
      </main>
      <footer>
        <Link to={"/"}>Back to Home</Link>
      </footer>
    </section>
  );

  return content;
};

export default Login;
