// Declaraciones limitadas para JSX.IntrinsicElements cuando haga falta
// Evitar declarar todo el módulo 'react' para no anular los tipos oficiales.

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
