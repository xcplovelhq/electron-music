<template>
  <div class="g-loading">
    <div class="loader double-circle"></div>
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style>
/*
The loaders use CSS custom properties (variables) to control the attributes of the loaders
*/
.g-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  width: 100%;
  font-size: 12px;
}
:root {
  --loader-width: 30px;
  --loader-height: 30px;
  --loader-color-primary: #444;
  --loader-color-secondary: #eee;
  --line-width: 2px;
  --animation-duration: 1s;
  --loader-initial-scale: 0.1;
}
.loader,
.loader:before,
.loader:after {
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
}
/*
In order to get optimal results, please only change the 
variables above and don't change anything in the actual loader code
*/

.loader.double-circle {
  position: relative;
  width: var(--loader-width, 100px);
  height: var(--loader-height, 100px);
}

.double-circle::before,
.double-circle::after {
  content: "";
  display: block;
  position: absolute;
  border-radius: 50%;
  border: var(--line-width, 4px) solid transparent;
  border-bottom-color: var(--loader-color-primary, #33f);
  animation: circle-loader var(--animation-duration, 1s) infinite linear;
}

.double-circle::before {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.double-circle::after {
  width: calc(100% - 12px);
  height: calc(100% - 12px);
  top: 6px;
  left: 6px;
  animation-direction: reverse;
}
@-webkit-keyframes circle-loader {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
