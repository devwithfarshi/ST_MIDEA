import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "../config/axiosConfig";

const CommentModal = ({ children, name, id, comments }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [error, setError] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [viewComments, setviewComments] = useState(comments);
  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newComment) {
      setError(true);
      return toast({
        title: "Write something",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    // add new comment to comments array
    setError(false);
    const token = JSON.parse(localStorage.getItem("stmedia")).token;
    axios
      .put(
        `/api/post/comment`,
        {
          postId: id,
          text: newComment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        },
      )
      .then(({ data }) => {
        setviewComments(data.comments);
      });
    // clear textarea
    setNewComment("");
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent
          maxH={"550px"}
          overflowY='scroll'
        >
          <ModalHeader>Comment on {name.split(" ")[0]}'s Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl>
                <FormLabel>Write your comment</FormLabel>
                <Textarea
                  isInvalid={error}
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder='Type your comment here...'
                  resize={"none"}
                />
              </FormControl>
              <Button
                mt={4}
                colorScheme='blue'
                type='submit'
              >
                Add comment
              </Button>
            </form>
            {viewComments.length > 0 && (
              <Box mt={4}>
                <FormLabel>Other comments:</FormLabel>
                {viewComments.map((comment, index) => {
                  return (
                    comment.comment && (
                      <Box
                        key={index}
                        p={2}
                        my={1}
                        borderWidth='1px'
                        borderRadius='md'
                      >
                        <HStack>
                          <Avatar
                            src={comment.postedBy.image}
                            name={comment.postedBy.name}
                          />
                          <Text>
                            {comment.postedBy.name.split(" ")[0]} :{" "}
                            {comment.comment}
                          </Text>
                        </HStack>
                      </Box>
                    )
                  );
                })}
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommentModal;
