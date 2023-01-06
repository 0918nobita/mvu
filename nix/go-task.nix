{ buildGoModule, fetchFromGitHub }:
buildGoModule rec {
  pname = "go-task";
  version = "3.19.1";

  src = fetchFromGitHub {
    rev = "v${version}";
    owner = "go-task";
    repo = "task";
    sha256 = "sha256-MtbgFx/+SVBcV6Yp1WEwKLQGx5oPxvqljtXeyUYNS+I=";
  };

  # FIXME: compute vendor hash in order to fetch dependencies into vendor directory
  vendorHash = null;
}
