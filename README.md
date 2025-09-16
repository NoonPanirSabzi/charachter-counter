# Character counter

## Table of contents

- [Overview](#overview)
  - [Screenshot and live site URL](#screenshot-and-live-site-url)
- [My process](#my-process)
  - [What I learned](#what-i-learned)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Attribution](#attribution)

## Overview

### Screenshot and live site URL

| Desktop                              | Tablet                             | Mobile                             |
| ------------------------------------ | ---------------------------------- | ---------------------------------- |
| ![desktop](/screenshot/desktop.jpeg) | ![Tablet](/screenshot/tablet.jpeg) | ![Mobile](/screenshot/mobile.jpeg) |

[Live Site URL](https://charachter-counter.netlify.app/)

## My process

### What I learned

1. Accessibility issues with fluid typography and how to solve them mathematically and with tools.
   This happens with both static media queries and responsive clamps.
   ([check useful resources](#useful-resources))

2. Default browser stylesheets apply a default `outline` effect on input texts.
   This can challenge junior developers when they want to set border effects for text inputs in the `focus` state, because the developer is unaware of the outline, and the outline covers the border.
   You should therefore set `outline: none` in the focus state to style it with a border the way you want.

3. The `inputmode="numeric"` HTML attribute in mobile browsers tells the browser to show the numeric keyboard.

4. `closest` Element method traverses the element and it's anscestors for a given valid CSS selector.

5. Using Local Storage with `setItem` and `getItem`. In this project it was used to save the user’s preferred theme so that when the page reloads we can apply the previous theme.

6. How to implement dark theme:

- write a set of custom variables in `:root` for colors in light theme
- overwrite those set of custom variables with a media query checking for `prefers-color-scheme: dark`  
  now our page matches **System** theme on first load
- in CSS, add an attribute or class to `:root`. once for when it's _light_ and once for _dark_.  
  then you have to copy all light and dark custom variables from before to these new declartions  
  these are used to force another theme when user toggles the theme and doesn't want the base System theme
- in js logic, when your toggle button is clicked you just need to update the class/attribute on root element
- don't forget to save the user theme preference to localStorage
- so in js logic, on page load you can check for localStorage and apply that theme
- all `img` elements in page can be inside a `picture` element. to combine it with a media query `prefers-color-scheme: dark`
  on first page load and chose the right `source` for the picture based on the query
- and in js logic, whenever you want to change the theme, provide a function to change source for all `picture` elements in the page
- (optional) Window object fires a `storage` event when value of a localStorage item is changed in another Window. we can take benefit of it in our
  theme logic so when the user toggles the theme in one tab(window), this event fires in other Windows that share the same localStorage.
  so you can update theme in those other Windows too.

```CSS
:root {
  /* base light theme color variables */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* base dark theme color variables */
  }
}

:root[data-theme="light"] {
  /* light theme variables go here again, to force light theme when System theme is dark */
}

:root[data-theme="dark"] {
  /* dark theme variables go here again, to force dark theme when System theme is light */
}
```

7. to provide a temporary animation effect during theme transition, toggle a class on body

```CSS
body.theme-transition * {
  transition: all 0.25s ease-in-out;
}
```

8. the difference between `focus` and `focus-visible` states: focus-visible happens only when the
   element gets focus with keyboard navigation. but focus state happens when the elements gets focus
   with keyboard, mouse, or any other input method.

9. `Object.hasOwn()` and `Object.entries()` methods. useful in many cases when working with objects

10. **Destructuring** can be combined with function parameters:

```javascript
// data = [ [k,v], [k,v], ... ]
const sorted = Object.entries(data).sort(
  ([, v1], [, v2]) => v2 - v1
);
```

11. when you need to use a set of values for parameters of a function, pass an options object containing
    all required values to the functions instead of a long list of seperate parameters.

12. `forEach`, `map`, `filter`, ... don't support `break` and `continue`. these two statements are only supported in
    `for`, `while` and `do While` syntax.

### Useful resources

- [this article explains what fluid typography is](https://www.aleksandrhovhannisyan.com/blog/fluid-type-scale-with-css-clamp/)
- [this article points to the accessibility problem that fluid typography can raise](https://adrianroselli.com/2019/12/responsive-type-and-zoom.html)
- [and this explains mathematically why this accessibility problem arises](https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/)
- [a simple tool to create clamp ranges while avoiding accessibility warnings](https://fluid.style/)
- [a good strategy to bring design primitives and semantics to code](https://uxdesign.cc/fluid-typography-in-design-systems-from-design-to-code-2b5f46a729b4)

## Author

- Github - [@AminForouzan](https://github.com/AminForouzan)
- Frontend Mentor - [@AminForouzan](https://www.frontendmentor.io/profile/AminForouzan)

## attribution

- [Character counter challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/character-counter-znSgeWs_i6).
