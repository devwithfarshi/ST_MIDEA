import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import styled from "styled-components";
import PeopleWhoLikesModal from "./PeopleWhoLikesModal";
import axios from "../config/axiosConfig.js";
import { useSelector } from "react-redux";
const ProfileInfo = ({ user, post }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const toast = useToast();
  const { user: realUesre } = useSelector((state) => state.user);
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
    setImage(e.target.files[0]);
  };

  const handlePost = () => {
    if (!image) {
      return toast({
        title: "Select an image",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    if (
      image.type === "image/png" ||
      image.type === "image/jpg" ||
      image.type === "image/jpeg"
    ) {
      setLoading(true);
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "st-midea");
      data.append("cloud_name", "sfsalmancloud");

      fetch(`https://api.cloudinary.com/v1_1/sfsalmancloud/image/upload`, {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setUrl(data.url);
        })
        .catch((err) => {
          console.log(`Cloudanary upload error -> ${err}`);
        });
    } else {
      return toast({
        title: "Select PNG or JPG file",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const postData = () => {
    const token = JSON.parse(localStorage.getItem("stmedia")).token;
    axios
      .put(
        "/api/user/uploadprofilepic",
        {
          photo: url,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        },
      )
      .then((data) => {
        setLoading(false);
        const preData = JSON.parse(localStorage.getItem("stmedia"));
        localStorage.setItem(
          "stmedia",
          JSON.stringify({ ...preData, image: url }),
        );
        window.location.reload();
        if (data.error) {
          return toast({
            title: data.error,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        } else {
          onClose();
          return toast({
            title: "Profile picture uploaded",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // saving profile to mongodb

    if (url) {
      postData();
    }
  }, [url]);

  useEffect(() => {
    // saving post to mongodb

    setPreview(user.image);
  }, []);

  return (
    <VStack
      w='full'
      gap='25px'
    >
      <Wrapper>
        <Avatar
          onClick={onOpen}
          size={"xl"}
          src={user.image}
          alt='profile image'
          name={user.name}
          cursor='pointer'
        />
        {user._id === realUesre._id && (
          <Modal
            isCentered
            isOpen={isOpen}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader textAlign={"center"}>Chage Your Profile</ModalHeader>
              <ModalCloseButton />
              <Divider />
              <ModalBody>
                <Box
                  w='full'
                  mb={4}
                >
                  <Image
                    mx={"auto"}
                    src={preview ? preview : user.image}
                  />
                </Box>

                <FormControl>
                  <FormLabel>
                    <Heading
                      size={"md"}
                      color={"facebook.900"}
                      textAlign='center'
                      cursor={"pointer"}
                      fontWeight='bold'
                    >
                      Change Profile
                    </Heading>
                  </FormLabel>
                  <Input
                    type='file'
                    accept='image/*'
                    hidden
                    onChange={onSelectFile}
                  />
                </FormControl>
                <Divider />

                <HStack justifyContent={"space-around"}>
                  <Button
                    bg='transparent'
                    _hover={{
                      bg: "transparent",
                    }}
                    size={"md"}
                    textAlign='center'
                    color='blue.500'
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    bg='transparent'
                    _hover={{
                      bg: "transparent",
                    }}
                    size={"md"}
                    textAlign='center'
                    color='green.700'
                    isLoading={loading}
                    loadingText='uploading..'
                    onClick={handlePost}
                  >
                    Change
                  </Button>
                </HStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
        <VStack
          w='full'
          p='0 20px'
          align={"flex-start"}
        >
          <Heading>{user.name}</Heading>
          <HStack textAlign={"center"}>
            <Text>{post.length} posts</Text>
            <Text>|</Text>
            <PeopleWhoLikesModal
              people={user.followers && user.followers}
              text={`${
                user.followers && user.followers.length
              } people following ${user.name}`}
            >
              <Text
                _hover={{
                  textDecoration: "underline",
                }}
                cursor={"pointer"}
              >
                {user.followers && user.followers.length} followers
              </Text>
            </PeopleWhoLikesModal>
            <Text>|</Text>
            <PeopleWhoLikesModal
              people={user.followers && user.following}
              text={`${user.name} following ${
                user.followers && user.following.length
              } people`}
            >
              <Text
                _hover={{
                  textDecoration: "underline",
                }}
                cursor={"pointer"}
              >
                {user.followers && user.following.length} following
              </Text>
            </PeopleWhoLikesModal>
          </HStack>
        </VStack>
      </Wrapper>
    </VStack>
  );
};

const Wrapper = styled.div`
  background-color: #aaa;
  width: 100%;
  padding: 20px;
  font-family: "Roboto", sans-serif;
  font-weight: 500;

  @media (max-width: 768px) {
    padding: 72px 0 20px 0;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
export default ProfileInfo;
