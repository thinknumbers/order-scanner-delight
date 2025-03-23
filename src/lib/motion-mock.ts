
// This is a mock implementation of the motion component from framer-motion
// In a real project, we would install and use framer-motion

export const motion = {
  div: ({ children, ...props }: any) => ({ type: 'div', props: { ...props, children } }),
  // Add more HTML elements as needed
};
