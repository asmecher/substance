## Beta 2

- Simplified Node API: Props are now stored on the node directly
- New source directory and file layout optimized for deep-requiring individual classes
- New DOMElement API for interacting with DOM elements
- Improved Converter API: Now independent from the Article class
- Overhauled API for Tools: Logic now lives in Command implementations that are independent from the UI
- Editors are now Components implementing the Surface API
- CSS overhaul: improved modularity, prefixing to avoid collisions
- New predefined node types: Embed, Superscript, Subscript, Code.
- Removed FormEditor interface in favour of more fine-grained control using new TextPropertyEditor component
- API docs provided via new Substance DocumentationReader

## Beta 1

Initial release