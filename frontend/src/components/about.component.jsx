import React from "react";
import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";
import {
  FaInstagram,
  FaYoutube,
  FaGithub,
  FaFacebook,
  FaTwitter,
} from "react-icons/fa";
import { TbWorld } from "react-icons/tb";

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
  // Map of social media names to icon components
  const socialIcons = {
    instagram: <FaInstagram className="w-6 h-6" />,
    youtube: <FaYoutube className="w-6 h-6" />,
    github: <FaGithub className="w-6 h-6" />,
    facebook: <FaFacebook className="w-6 h-6" />,
    twitter: <FaTwitter className="w-6 h-6" />,
    website: <TbWorld className="w-6 h-6" />,
  };

  return (
    <div className={"md:w-[90%] md:mt-7 " + className}>
      <p className="text-xl leading-7">
        {bio?.length ? bio : "Nothing to read here"}
      </p>
      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
        {Object.entries(social_links).map(([key, link]) => {
          if (!link) return null; // Skip if the link is empty
          const icon = socialIcons[key.toLowerCase()]; // Get the icon dynamically
          return (
            <Link
              key={key}
              target="_blank"
              to={link}
              className="flex items-center gap-2 "
            >
              {icon} {/* Render the icon */}
              <span className="text-xl ">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
            </Link>
          );
        })}
      </div>
      <p className="leading-7 text-xl text-dark-grey">{getFullDay(joinedAt)}</p>
    </div>
  );
};

export default AboutUser;
