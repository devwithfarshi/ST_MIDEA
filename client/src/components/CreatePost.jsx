import {
  Avatar,
  Button,
  Container,
  Divider,
  Heading,
  HStack,
  Image,
  Input,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "../config/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState("");

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const toast = useToast();

  // create a preview as a side effect, whenever selected file is changed
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

  const postData = () => {
    const token = JSON.parse(localStorage.getItem("stmedia")).token;
    axios
      .post(
        "/api/post/createPost",
        {
          title,
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
        if (data.error) {
          return toast({
            title: data.error,
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
        } else {
          navigate(-1);
          return toast({
            title: "Post sheared",
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
    // saving post to mongodb

    if (url) {
      postData();
    }
  }, [url]);

  const handlePost = () => {
    if (!image && !title) {
      return toast({
        title: "Write a caption or a iamge",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    if (image) {
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
    } else {
      postData();
    }
  };

  return (
    <Container>
      <VStack
        align={"flex-start"}
        border={{ base: 0, md: "1px solid rgb(173,173,173)" }}
        mt={1}
        p={{ base: 0, md: 4 }}
        gap={{ base: "12px", md: "25px" }}
      >
        <VStack w='full'>
          <Heading>Create New Post</Heading>
          <Divider />
        </VStack>
        <Input
          type='file'
          accept='image/*'
          outline={"none"}
          border='0'
          onChange={onSelectFile}
        />

        <HStack align={"flex-start"}>
          <Avatar
            src={user.image}
            name={user.name}
            size={"sm"}
          />
          <Heading size={"md"}>{user.name}</Heading>
        </HStack>
        {selectedFile && (
          <Image
            src={preview}
            alt='selected img'
            width={"100%"}
          />
        )}
        <Textarea
          placeholder='Write a Caption...'
          resize={"none"}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
        ></Textarea>
        <Button
          onClick={handlePost}
          isLoading={loading}
          colorScheme={"facebook"}
        >
          Post
        </Button>
      </VStack>
    </Container>
  );
};

export default CreatePost;
