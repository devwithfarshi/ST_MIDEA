import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
// import { BsThreeDotsVertical } from "@chakra-ui/icons";
import { BsThreeDotsVertical, BsThreeDots } from "react-icons/bs";
import { BiChat, BiShare } from "react-icons/bi";
import {
  AiOutlineDelete,
  AiOutlineHeart,
  AiOutlinePaperClip,
} from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import CommentModal from "./CommentModal";
import { useEffect, useState } from "react";
import axios from "../config/axiosConfig";
import { useSelector } from "react-redux";
import PeopleWhoLikesModal from "./PeopleWhoLikesModal";
import { NavLink } from "react-router-dom";
const Post = ({
  id,
  name,
  image,
  photo,
  title,
  time,
  likes,
  comments,
  postedBy,
  handleDeletePost,
}) => {
  let token;
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState();
  const [likedPeople, setlikedPeople] = useState([]);
  const { user } = useSelector((state) => state.user);

  const handleLike = (id) => {
    const token = JSON.parse(localStorage.getItem("stmedia")).token;
    axios
      .put(
        `/api/post/like`,
        { postId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        },
      )
      .then(() => {
        setLiked(true);
        setLikesCount(likesCount + 1);
        setlikedPeople((preValue) => {
          return [...preValue, { _id: user._id, name: user.name }];
        });
      })
      .catch((err) => {
        `Post like error --> ${err}`;
      });
  };
  const handleUnLike = (id) => {
    token = JSON.parse(localStorage.getItem("stmedia")).token;
    axios
      .put(
        `/api/post/unlike`,
        { postId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        },
      )
      .then(() => {
        setLiked(false);
        likesCount > 0 ? setLikesCount(likesCount - 1) : setLikesCount(0);
        setlikedPeople((preValue) => {
          const newLikedPeople = preValue.filter((u) => u._id !== user._id);
          return newLikedPeople;
        });
      })
      .catch((err) => {
        `Post like error --> ${err}`;
      });
  };

  useEffect(() => {
    token = JSON.parse(localStorage.getItem("stmedia")).token;
    const isLiked = likes.includes(user._id);
    setLikesCount(likes.length ? likes.length : 0);
    setLiked(isLiked);
  }, []);
  useEffect(() => {
    axios
      .get(`/api/post/fetchlikespeople/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
      .then(({ data }) => {
        setlikedPeople(data.likes);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Card maxW='lg'>
        <CardHeader>
          <Flex spacing='4'>
            <NavLink
              style={{
                width: "100%",
              }}
              to={`/profile/${postedBy._id}`}
            >
              <Flex
                w='full'
                flex='1'
                gap='4'
                alignItems='center'
                flexWrap='wrap'
              >
                <Avatar
                  name={postedBy.name}
                  src={image}
                />

                <Box>
                  <Heading size='sm'>{name}</Heading>

                  <Text>{time}</Text>
                </Box>
              </Flex>
            </NavLink>

            <Menu>
              {({ isOpen }) => (
                <>
                  <MenuButton>
                    {!isOpen ? (
                      <IconButton
                        bg='none'
                        aria-label='See menu'
                        isActive={isOpen}
                        as={Button}
                        icon={<BsThreeDotsVertical />}
                      />
                    ) : (
                      <IconButton
                        bg='none'
                        aria-label='See menu'
                        isActive={isOpen}
                        as={Button}
                        icon={<BsThreeDots />}
                      />
                    )}
                  </MenuButton>
                  <MenuList>
                    {user._id === postedBy._id && (
                      <MenuItem
                        display={"flex"}
                        alignItems='center'
                        gap={"10px"}
                        onClick={() => handleDeletePost(id)}
                      >
                        <AiOutlineDelete /> Move To Trash
                      </MenuItem>
                    )}
                    <MenuItem>
                      <AiOutlinePaperClip /> Copy Link
                    </MenuItem>
                  </MenuList>
                </>
              )}
            </Menu>
          </Flex>
        </CardHeader>
        <CardBody>{title !== "" && <Text>{title}</Text>}</CardBody>
        {photo && (
          <Image
            objectFit='cover'
            src={photo}
            alt='Chakra UI'
          />
        )}

        <CardFooter
          justify='space-between'
          flexWrap='wrap'
          sx={{
            "& > button": {
              minW: "136px",
            },
          }}
        >
          <VStack
            align={"flex-start"}
            w='full'
          >
            {likedPeople.length > 0 && (
              <PeopleWhoLikesModal
                people={likedPeople}
                text={"People who likes this post"}
              >
                <Text
                  cursor={"pointer"}
                  _hover={{
                    textDecoration: "underline",
                  }}
                >
                  {likedPeople.slice(0, 3).map((v) => {
                    return v.name.split(" ")[0] + ", ";
                  })}{" "}
                  {likedPeople.length > 3
                    ? "and others like this post"
                    : "like this post"}
                </Text>
              </PeopleWhoLikesModal>
            )}
            <HStack w='full'>
              <Button
                onClick={() => (liked ? handleUnLike(id) : handleLike(id))}
                flex='1'
                variant='ghost'
                leftIcon={liked ? <FcLike /> : <AiOutlineHeart />}
              >
                Like{liked ? "d" : ""} {likesCount > 0 ? `(${likesCount})` : ""}
              </Button>
              <CommentModal
                name={name}
                id={id}
                comments={comments}
              >
                <Button
                  flex='1'
                  variant='ghost'
                  leftIcon={<BiChat />}
                >
                  Comment
                </Button>
              </CommentModal>
              <Button
                flex='1'
                variant='ghost'
                leftIcon={<BiShare />}
              >
                Share
              </Button>
            </HStack>
          </VStack>
        </CardFooter>
      </Card>
    </>
  );
};

export default Post;
