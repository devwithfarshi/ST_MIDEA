import { Button, Container, Divider, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Post from "../components/Post";
import axios from "../config/axiosConfig";
const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const toast = useToast();
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("stmedia"))) {
      return navigate("/signup");
    }
    fetchPost();
  }, []);

  const fetchPost = () => {
    if (user) {
      const token = JSON.parse(localStorage.getItem("stmedia")).token;

      axios
        .get("api/post/allposts", {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        })
        .then(({ data }) => {
          setPosts(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDeletePost = (id) => {
    const token = JSON.parse(localStorage.getItem("stmedia")).token;

    axios
      .delete(`/api/post/deletePost/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(({ data }) => {
        const newArray = posts.filter((d) => d._id !== id);
        setPosts(newArray);
        toast({
          title: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      })
      .catch((err) => {
        console.log(`Delete error -> ${err}`);
      });
  };

  return (
    <Wrapper>
      <Container my={5}>
        <NavLink to='/createpost'>
          <Button
            w='100%'
            colorScheme={"facebook"}
            h='50px'
          >
            Post Something
          </Button>
        </NavLink>
      </Container>
      {}
      <Container>
        {posts &&
          posts.map((value, i) => {
            return (
              <>
                <Post
                  key={i}
                  id={value._id}
                  name={value.postedBy.name}
                  image={value.postedBy.image}
                  photo={value.photo}
                  time={value.createdAt}
                  title={value.title}
                  likes={value.likes}
                  comments={value.comments}
                  postedBy={value.postedBy}
                  handleDeletePost={handleDeletePost}
                />
                <Divider p={2} />
              </>
            );
          })}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  display: flex;

  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 25px;
`;

export default Home;
