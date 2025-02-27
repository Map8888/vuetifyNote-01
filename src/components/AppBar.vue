<template>
  <v-system-bar fixed>
    <v-icon icon="mdi-keyboard-backspace" @click="$router.back()"></v-icon>
    <v-spacer></v-spacer>
    <v-icon icon="mdi-home" @click="$router.push('/')"></v-icon>
    <v-spacer></v-spacer>
    <v-icon icon="mdi-wifi-strength-4"></v-icon>
    <v-icon icon="mdi-signal" class="ms-2"></v-icon>
    <v-icon icon="mdi-battery" class="ms-2"></v-icon>

    <span class="ms-2">3:13PM</span>
  </v-system-bar>
</template>