import {
  Button,
  Container,
  Divider,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Post from "../components/Post";
import axios from "../config/axiosConfig";
const MyFollowingPost = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    if (!user) {
      return navigate("/signup");
    }
    fetchPost();
  }, []);

  const fetchPost = () => {
    const token = JSON.parse(localStorage.getItem("stMidea")).token;

    axios
      .get("api/post/myfollowingpost", {
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
            Post Somethig
          </Button>
        </NavLink>
      </Container>
      <Container>
        {posts.length > 0 ? (
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
                />
                <Divider p={2} />
              </>
            );
          })
        ) : (
          <>
            <Heading
              textAlign={"center"}
              color={"black"}
            >
              Follow Some to see posts
            </Heading>
          </>
        )}
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

export default MyFollowingPost;
