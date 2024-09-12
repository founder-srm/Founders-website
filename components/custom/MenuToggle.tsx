'use client'
import React from "react";
import { motion, SVGMotionProps } from "framer-motion";

const Path = (props: React.JSX.IntrinsicAttributes & SVGMotionProps<SVGPathElement> & React.RefAttributes<SVGPathElement>) => (
    <motion.path
        fill="transparent"
        strokeWidth="3"
        stroke="hsl(0, 0%, 18%)"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    />
);
//   const pathVariants = {
//     closed: { d: "M 2 2.5 L 20 2.5" },
//     open: { d: "M 3 16.5 L 17 2.5" }
//   };

//   const middlePathVariants = {
//     closed: { opacity: 1 },
//     open: { opacity: 0 }
//   };

interface MenuToggleProps {
    menuOpen: boolean;
    toggleOpen: () => void;
}

const MenuToggle = ({ toggleOpen, menuOpen }: MenuToggleProps) => {
    return(
        <button onClick={toggleOpen}>
            <svg width="23" height="23" viewBox="0 0 23 23">
                <motion.g fill="none" stroke="currentColor" strokeWidth="3">
                    <Path
                        variants={{
                            closed: { d: "M 2 2.5 L 20 2.5" },
                            open: { d: "M 3 16.5 L 17 2.5" }
                        }}
                        initial="closed"
                        animate={menuOpen ? "open" : "closed"}
                    />
                    <Path
                        d="M 2 9.423 L 20 9.423"
                        variants={{
                            closed: { opacity: 1 },
                            open: { opacity: 0 }
                        }}
                        initial="closed"
                        animate={menuOpen ? "open" : "closed"}
                        transition={{ duration: 0.1 }}
                    />
                    <Path
                        variants={{
                            closed: { d: "M 2 16.346 L 20 16.346" },
                            open: { d: "M 3 2.5 L 17 16.346" }
                        }}
                        initial="closed"
                        animate={menuOpen ? "open" : "closed"}
                    />
                </motion.g>
            </svg>
        </button>
    )
}

export default MenuToggle;