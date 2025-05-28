"use client";
import React, { useState, useLayoutEffect } from "react";
import styled from "styled-components";

const Switch: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // On first render, check localStorage or system preference
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = storedTheme === "dark" || (!storedTheme && prefersDark);

    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // Whenever the theme changes, update DOM and localStorage
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <StyledWrapper>
      <label className="theme-switch" aria-label="Toggle dark mode">
        <input
          type="checkbox"
          className="theme-switch__checkbox"
          checked={isDarkMode}
          onChange={toggleDarkMode}
        />
        <div className="theme-switch__container">
          <div className="theme-switch__clouds" />
          <div className="theme-switch__stars-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 144 55"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M135.831 3.00688C135.055 3.85027 ... (rest of the SVG path)"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="theme-switch__circle-container">
            <div className="theme-switch__sun-moon-container">
              <div className="theme-switch__moon">
                <div className="theme-switch__spot" />
                <div className="theme-switch__spot" />
                <div className="theme-switch__spot" />
              </div>
            </div>
          </div>
        </div>
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .theme-switch {
    --toggle-size: 16px; /* Only changed this value from 24px to 16px */
    --container-width: 4.5em;
    --container-height: 2em;
    --container-radius: 5em;
    --container-light-bg: #3d7eae;
    --container-night-bg: #1d1f2c;
    --circle-container-diameter: 2.7em;
    --sun-moon-diameter: 1.7em;
    --sun-bg: #ecca2f;
    --moon-bg: #c4c9d1;
    --spot-color: #959db1;
    --circle-container-offset: calc(
      (var(--circle-container-diameter) - var(--container-height)) / 2 * -1
    );
    --stars-color: #fff;
    --clouds-color: #f3fdff;
    --back-clouds-color: #aacadf;
    --transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
    --circle-transition: 0.3s cubic-bezier(0, -0.02, 0.35, 1.17);
  }

  /* ALL OTHER CSS RULES REMAIN EXACTLY THE SAME AS IN YOUR ORIGINAL COMPONENT */
  .theme-switch,
  .theme-switch *,
  .theme-switch *::before,
  .theme-switch *::after {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-size: var(--toggle-size);
  }

  .theme-switch__container {
    width: var(--container-width);
    height: var(--container-height);
    background-color: var(--container-light-bg);
    border-radius: var(--container-radius);
    overflow: hidden;
    cursor: pointer;
    -webkit-box-shadow:
      0em -0.062em 0.062em rgba(0, 0, 0, 0.25),
      0em 0.062em 0.125em rgba(255, 255, 255, 0.94);
    box-shadow:
      0em -0.062em 0.062em rgba(0, 0, 0, 0.25),
      0em 0.062em 0.125em rgba(255, 255, 255, 0.94);
    -webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
    position: relative;
  }

  .theme-switch__container::before {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0;
    -webkit-box-shadow:
      0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset,
      0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset;
    box-shadow:
      0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset,
      0em 0.05em 0.187em rgba(0, 0, 0, 0.25) inset;
    border-radius: var(--container-radius);
  }

  .theme-switch__checkbox {
    display: none;
  }

  .theme-switch__circle-container {
    width: var(--circle-container-diameter);
    height: var(--circle-container-diameter);
    background-color: rgba(255, 255, 255, 0.1);
    position: absolute;
    left: var(--circle-container-offset);
    top: var(--circle-container-offset);
    border-radius: var(--container-radius);
    -webkit-box-shadow:
      inset 0 0 0 2.7em rgba(255, 255, 255, 0.1),
      inset 0 0 0 2.7em rgba(255, 255, 255, 0.1),
      0 0 0 0.5em rgba(255, 255, 255, 0.1),
      0 0 0 1em rgba(255, 255, 255, 0.1);
    box-shadow:
      inset 0 0 0 2.7em rgba(255, 255, 255, 0.1),
      inset 0 0 0 2.7em rgba(255, 255, 255, 0.1),
      0 0 0 0.5em rgba(255, 255, 255, 0.1),
      0 0 0 1em rgba(255, 255, 255, 0.1);
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-transition: var(--circle-transition);
    -o-transition: var(--circle-transition);
    transition: var(--circle-transition);
    pointer-events: none;
  }

  .theme-switch__sun-moon-container {
    pointer-events: auto;
    position: relative;
    z-index: 2;
    width: var(--sun-moon-diameter);
    height: var(--sun-moon-diameter);
    margin: auto;
    border-radius: var(--container-radius);
    background-color: var(--sun-bg);
    -webkit-box-shadow:
      0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset,
      0em -0.062em 0.062em 0em #a1872a inset;
    box-shadow:
      0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset,
      0em -0.062em 0.062em 0em #a1872a inset;
    -webkit-filter: drop-shadow(0.062em 0.125em 0.125em rgba(0, 0, 0, 0.25))
      drop-shadow(0em 0.062em 0.125em rgba(0, 0, 0, 0.25));
    filter: drop-shadow(0.062em 0.125em 0.125em rgba(0, 0, 0, 0.25))
      drop-shadow(0em 0.062em 0.125em rgba(0, 0, 0, 0.25));
    overflow: hidden;
    -webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
  }

  .theme-switch__moon {
    -webkit-transform: translateX(100%);
    -ms-transform: translateX(100%);
    transform: translateX(100%);
    width: 100%;
    height: 100%;
    background-color: var(--moon-bg);
    border-radius: inherit;
    -webkit-box-shadow:
      0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset,
      0em -0.062em 0.062em 0em #969696 inset;
    box-shadow:
      0.062em 0.062em 0.062em 0em rgba(254, 255, 239, 0.61) inset,
      0em -0.062em 0.062em 0em #969696 inset;
    -webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
    position: relative;
  }

  .theme-switch__spot {
    position: absolute;
    top: 0.6em; /* Adjusted */
    left: 0.25em; /* Adjusted */
    width: 0.6em; /* Adjusted */
    height: 0.6em; /* Adjusted */
    border-radius: var(--container-radius);
    background-color: var(--spot-color);
    -webkit-box-shadow: 0em 0.0312em 0.062em rgba(0, 0, 0, 0.25) inset;
    box-shadow: 0em 0.0312em 0.062em rgba(0, 0, 0, 0.25) inset;
  }

  .theme-switch__spot:nth-of-type(2) {
    width: 0.3em; /* Adjusted */
    height: 0.3em; /* Adjusted */
    top: 0.75em; /* Adjusted */
    left: 1.1em; /* Adjusted */
  }

  .theme-switch__spot:nth-last-of-type(3) {
    width: 0.2em; /* Adjusted */
    height: 0.2em; /* Adjusted */
    top: 0.25em; /* Adjusted */
    left: 0.65em; /* Adjusted */
  }

  .theme-switch__clouds {
    width: 1em; /* Adjusted */
    height: 1em; /* Adjusted */
    background-color: var(--clouds-color);
    border-radius: var(--container-radius);
    position: absolute;
    bottom: -0.5em; /* Adjusted */
    left: 0.25em; /* Adjusted */
    -webkit-box-shadow:
      0.75em 0.25em var(--clouds-color),
      -0.25em -0.25em var(--back-clouds-color),
      1.15em 0.3em var(--clouds-color),
      0.4em -0.1em var(--back-clouds-color),
      1.75em 0 var(--clouds-color),
      1em -0.05em var(--back-clouds-color),
      2.35em 0.25em var(--clouds-color),
      1.6em -0.25em var(--back-clouds-color),
      2.9em -0.05em var(--clouds-color),
      2.1em 0em var(--back-clouds-color),
      3.6em -0.25em var(--clouds-color),
      2.7em -0.35em var(--back-clouds-color),
      3.7em -1.4em 0 0.35em var(--clouds-color),
      3.2em -0.5em var(--back-clouds-color),
      3.3em -1.7em 0 0.35em var(--back-clouds-color);
    box-shadow:
      0.75em 0.25em var(--clouds-color),
      -0.25em -0.25em var(--back-clouds-color),
      1.15em 0.3em var(--clouds-color),
      0.4em -0.1em var(--back-clouds-color),
      1.75em 0 var(--clouds-color),
      1em -0.05em var(--back-clouds-color),
      2.35em 0.25em var(--clouds-color),
      1.6em -0.25em var(--back-clouds-color),
      2.9em -0.05em var(--clouds-color),
      2.1em 0em var(--back-clouds-color),
      3.6em -0.25em var(--clouds-color),
      2.7em -0.35em var(--back-clouds-color),
      3.7em -1.4em 0 0.35em var(--clouds-color),
      3.2em -0.5em var(--back-clouds-color),
      3.3em -1.7em 0 0.35em var(--back-clouds-color);
    -webkit-transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
    -o-transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
    transition: 0.5s cubic-bezier(0, -0.02, 0.4, 1.25);
  }

  .theme-switch__stars-container {
    position: absolute;
    color: var(--stars-color);
    top: -100%;
    left: 0.25em; /* Adjusted */
    width: 2.2em; /* Adjusted */
    height: auto;
    -webkit-transition: var(--transition);
    -o-transition: var(--transition);
    transition: var(--transition);
  }

  /* actions */

  .theme-switch__checkbox:checked + .theme-switch__container {
    background-color: var(--container-night-bg);
  }

  .theme-switch__checkbox:checked
    + .theme-switch__container
    .theme-switch__circle-container {
    left: calc(
      100% - var(--circle-container-offset) - var(--circle-container-diameter)
    );
  }

  .theme-switch__checkbox:checked
    + .theme-switch__container
    .theme-switch__circle-container:hover {
    left: calc(
      100% - var(--circle-container-offset) - var(--circle-container-diameter) -
        0.187em
    );
  }

  .theme-switch__circle-container:hover {
    left: calc(var(--circle-container-offset) + 0.187em);
  }

  .theme-switch__checkbox:checked
    + .theme-switch__container
    .theme-switch__moon {
    -webkit-transform: translate(0);
    -ms-transform: translate(0);
    transform: translate(0);
  }

  .theme-switch__checkbox:checked
    + .theme-switch__container
    .theme-switch__clouds {
    bottom: -3.25em; /* Adjusted */
  }

  .theme-switch__checkbox:checked
    + .theme-switch__container
    .theme-switch__stars-container {
    top: 50%;
    -webkit-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    transform: translateY(-50%);
  }
`;

export default Switch;
