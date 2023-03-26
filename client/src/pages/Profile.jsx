import { Button, Container, Divider, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Post from "../components/Post";
import ProfileGallery from "../components/ProfileGallery";
import ProfileInfo from "../components/ProfileInfo";
import axios from "../config/axiosConfig";
const Profile = ({ user }) => {
  const [myPosts, setMyPosts] = useState([]);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);

  const toast = useToast();
  const { userId } = useParams();
  const photos = myPosts
    .map((value, i) => {
      if (value.photo !== "") {
        return value.photo;
      }
    })
    .filter((p) => p !== undefined);

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
        const newArray = myPosts.filter((d) => d._id !== id);
        setMyPosts(newArray);
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

  const handleFollow = () => {
    const token = JSON.parse(localStorage.getItem("stmedia")).token;
    axios
      .put(
        `/api/user/follow`,
        { followId: userDetails._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        },
      )
      .then(({ data }) => {
        setIsFollowing(true);
      });
  };
  const handleUnFollow = () => {
    const token = JSON.parse(localStorage.getItem("stmedia")).token;
    axios
      .put(
        `/api/user/unfollow`,
        { followId: userDetails._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        },
      )
      .then(({ data }) => {
        setIsFollowing(false);
      });
  };

  useEffect(() => {
    if (!user) {
      return navigate("/signup");
    }

    const token = JSON.parse(localStorage.getItem("stmedia")).token;
    axios
      .get(`/api/user/profile/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(({ data }) => {
        console.log(data);
        setMyPosts(data.post);
        setUserDetails(data.user);
        const idArray = data.user.followers.map((v) => {
          return v._id;
        });
        if (idArray.includes(JSON.parse(localStorage.getItem("stmedia"))._id)) {
          setIsFollowing(true);
        }
      });
  }, [isFollowing]);
  return (
    <Container p={0}>
      <Wrapper>
        <VStack align={"flex-start"}>
          <ProfileInfo
            user={userDetails}
            post={myPosts}
          />
          {userDetails._id === user._id ? (
            <NavLink to='/createpost'>
              <Button
                w='100px'
                colorScheme={"facebook"}
              >
                Post
              </Button>
            </NavLink>
          ) : (
            <>
              <Button
                onClick={isFollowing ? handleUnFollow : handleFollow}
                colorScheme={"pink"}
              >
                {isFollowing ? "Folloing" : "Follow"}
              </Button>
            </>
          )}

          <Divider />
        </VStack>
        <VStack>
          <ProfileGallery photos={photos} />
          <Divider />
        </VStack>
        <Container>
          {myPosts &&
            myPosts.map((value, i) => {
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
    </Container>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 25px;
`;
export default Profile;
