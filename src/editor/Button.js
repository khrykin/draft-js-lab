import React from 'react';

export default function Button({
  onClick,
  children,
  className,
  active
}) {
  return (
    <div
      className={
        `pointer dib pa1 br1 ph2 ma1 ` +
        (active ?
          `bg-white hover-bg-gray black` :
          `bg-transparent hover-bg-gray hover-white`
        ) +
        `${className ? ' ' + className : ''}`
      }
      onClick={onClick}>
      { children }
    </div>
  );
}
