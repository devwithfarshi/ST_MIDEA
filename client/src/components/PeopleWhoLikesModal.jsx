import {
  Avatar,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

const PeopleWhoLikesModal = ({ children, people, text }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          <ModalHeader>{text}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              spacing={2}
              align='flex-start'
            >
              {people &&
                people.map((p, i) => {
                  return (
                    <a
                      target={"_blank"}
                      href={`/profile/${p._id}`}
                    >
                      <HStack key={i}>
                        <Avatar
                          src={p.image}
                          name={p.name}
                        />
                        <Text>{p.name}</Text>
                      </HStack>
                    </a>
                  );
                })}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PeopleWhoLikesModal;
