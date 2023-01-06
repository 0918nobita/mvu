{ pkgs ? import <nixpkgs> {} }:
let goTask = pkgs.callPackage ./nix/go-task.nix {}; in
pkgs.mkShell {
  buildInputs = [
    goTask
  ];
}
