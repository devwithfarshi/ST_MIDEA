import {
  Box,
  Container,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import Masonry from "react-responsive-masonry";
import PropType from "prop-types";
const ProfileGallery = ({ photos }) => {
  const displayImages = photos.slice(0, 3); // Display up to 6 images
  const remainingCount = photos.length - 3;
  return (
    <>
      <Heading>My Gallery</Heading>
      <SimpleGrid
        columns={[2, 3, 4]}
        columnGap={2}
        rowGap={2}
        alignItems='center'
        overflowY='scroll'
        padding='10px'
      >
        {displayImages.map((image, index) => (
          <Image
            key={index}
            src={image}
            h='100%'
            cursor={"pointer"}
            alt={image + "name"}
          />
        ))}
        {remainingCount > 0 && (
          <span
            style={{
              background: "rgba(0,0,0,0.3)",
              cursor: "pointer",
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              fontWeight: "bold",
            }}
          >
            <div className='image-count'>+{remainingCount} more</div>
          </span>
        )}
      </SimpleGrid>
    </>
  );
};

export default ProfileGallery;
