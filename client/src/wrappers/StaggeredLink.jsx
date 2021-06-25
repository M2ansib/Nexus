import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useHistory, useLocation } from "react-router-dom";

// Functional link component which delays page navigation
export const StaggeredLink = props => {
  const { delay, onDelayStart, onDelayEnd, replace, to, ...rest } = props;
  let timeout = null;
  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [timeout]);

  const handleClick = e => {
    // if trying to navigate to current page stop everything
    if (location?.pathname === to) return;

    onDelayStart(e, to);
    if (e.defaultPrevented) {
      return;
    }

    e.preventDefault();

    timeout = setTimeout(() => {
      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
      onDelayEnd(e, to);
    }, delay);
  };

  return <Link {...rest} to={to} onClick={handleClick} />;
};

StaggeredLink.propTypes = {
  // Milliseconds to wait before registering the click.
  delay: PropTypes.number,
  // Called after the link is clicked and before the delay timer starts.
  onDelayStart: PropTypes.func,
  // Called after the delay timer ends.
  onDelayEnd: PropTypes.func,
  // Replace history or not
  replace: PropTypes.bool,
  // Link to go to
  to: PropTypes.string
};

StaggeredLink.defaultProps = {
  replace: false,
  delay: 1000,
  onDelayStart: () => {},
  onDelayEnd: () => {}
};

export default StaggeredLink;