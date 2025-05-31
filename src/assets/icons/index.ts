import {
  IoIosArrowDown,
  IoIosArrowUp,
  IoMdMic,
  IoMdMicOff,
  IoIosShareAlt,
  IoIosStar,
  IoIosStarHalf,
  IoIosStarOutline,
  IoMdEye,
  IoMdEyeOff,
} from "react-icons/io";
import { IoHomeOutline, IoHomeSharp, IoCart } from "react-icons/io5";
import {
  PiNoteLight,
  PiNotebookLight,
  PiShareFatLight,
  PiNoteFill,
} from "react-icons/pi";
import { FaStackOverflow } from "react-icons/fa";
import {
  AiOutlineSetting,
  AiOutlineSearch,
  AiOutlinePlus,
  AiOutlineTag,
  AiFillTag,
  AiFillHome,
  AiOutlineHome,
} from "react-icons/ai";

import {
  BiSolidVideos,
  BiLike,
  BiDislike,
  BiSolidLike,
  BiSolidDislike,
} from "react-icons/bi";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";
import { SlOptionsVertical, SlOptions } from "react-icons/sl";
import { RiVideoAddLine } from "react-icons/ri";
import { BsBell, BsBellSlash, BsDot } from "react-icons/bs";
import { LiaDownloadSolid } from "react-icons/lia";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdSubscriptions,
  MdOutlineSubscriptions,
  MdOutlineHistory,
  MdDelete,
  MdPayment,
  MdFileDownloadDone,
  MdRefresh,
} from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiMinus } from "react-icons/fi";
import { CiFilter } from "react-icons/ci";

import { PiNotepadFill } from "react-icons/pi";

const ReactIcons = {
  notepad: PiNotepadFill,
  eyeOn: IoMdEye,
  eyeOff: IoMdEyeOff,
  star: IoIosStar,
  star_half: IoIosStarHalf,
  star_empty: IoIosStarOutline,
  filter: CiFilter,
  minus: FiMinus,
  payment: MdPayment,
  profile: CgProfile,
  myOrders: MdFileDownloadDone,
  deleteIcon: MdDelete,
  downArrow: IoIosArrowDown,
  setting: AiOutlineSetting,
  search: AiOutlineSearch,
  plus: AiOutlinePlus,
  homeOutline: IoHomeOutline,
  homeSolid: IoHomeSharp,
  notes: PiNoteLight,
  notesSolid: PiNoteFill,
  notebooks: PiNotebookLight,
  tagOutline: AiOutlineTag,
  tagSolid: AiFillTag,
  share: PiShareFatLight,
  stack: FaStackOverflow,
  outlineSubscription: MdOutlineSubscriptions,
  solidSubscription: MdSubscriptions,
  outlineHome: AiOutlineHome,
  solidHome: AiFillHome,
  solidVideo: BiSolidVideos,
  hamburger: RxHamburgerMenu,
  cancel: RxCross2,
  micOn: IoMdMic,
  micOff: IoMdMicOff,
  video: RiVideoAddLine,
  bellOn: BsBell,
  bellOff: BsBellSlash,
  leftArrow: MdKeyboardArrowLeft,
  rightArrow: MdKeyboardArrowRight,
  upArrow: IoIosArrowUp,
  likeIcon: BiLike,
  solidLikeIcon: BiSolidLike,
  dislikeIcon: BiDislike,
  solidDislikeIcon: BiSolidDislike,
  shareDark: IoIosShareAlt,
  options: SlOptionsVertical,
  horizontalOptions: SlOptions,
  singleDot: BsDot,
  download: LiaDownloadSolid,
  history: MdOutlineHistory,
  cart: IoCart,
  refresh: MdRefresh,
};

export default ReactIcons;
