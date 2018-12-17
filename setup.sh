#! /bin/bash
pwd=$(pwd)
export PATH="$PATH:$pwd/bin"

if [ ! -f $HOME/.bashrc ]
then
  touch "$HOME/.bashrc"
  echo "export PATH=\"\$PATH:$pwd/bin\"" >> $HOME/.bashrc
else
  echo "export PATH=\"\$PATH:$pwd/bin\"" >> $HOME/.bashrc
fi
