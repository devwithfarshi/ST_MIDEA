import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import CreatePost from "./components/CreatePost";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MyFollowingPost from "./pages/MyFollowingPost";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { setUser } from "./store/slices/userSlice";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("stmedia"));
    if (user) {
      dispatch(setUser(user));
    } else {
      navigate("/signup");
    }
  }, []);
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/profile/:userId'
          element={<Profile user={user} />}
        />
        <Route
          path='/signup'
          element={<SignUp />}
        />
        <Route
          path='/signin'
          element={<SignIn />}
        />
        <Route
          path='/createpost'
          element={<CreatePost />}
        />
        <Route
          path='/myfollowingpost'
          element={<MyFollowingPost />}
        />
      </Routes>
    </>
  );
}

export default App;
