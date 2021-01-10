#!/usr/bin/env bash

trap 'echo "Exit"; exit 1' INT


### restore projects
CURRENT_RESTORE_HASH=$(git rev-parse HEAD)
RESTORE_HASH_FILE="./.restore-hash"
OLD_RESTORE_HASH=$(cat $RESTORE_HASH_FILE 2>/dev/null)

if [ "$OLD_RESTORE_HASH" == "$CURRENT_RESTORE_HASH" ]; then
    echo "Skip restore"
else
    echo "Restoring deps"

    (cd dotnet && dotnet restore) &
    (cd react-app && npm ci) &
    wait

    echo "$CURRENT_RESTORE_HASH" > $RESTORE_HASH_FILE
    echo "Restoring complete"
fi


FILES=()

while IFS=  read -r -d $'\0'; do
    FILES+=("$REPLY")
done < <(find . \
       -type f \
       -maxdepth 5 \
       -not -path "**/node_modules/*" \
       -not -path "**/bin/*" \
       -not -path "**/obj/*" \
       -not -path "**/.git/*" \
       \( -name 'package-lock.json'  -o -name '*.csproj'  -o -iname 'dockerfile*' \) \
       -print0 \
       2>/dev/null)

HASH_FILE="./.rebuild-compose"
CURRENT_HASH=''
OLD_HASH=$(cat $HASH_FILE 2>/dev/null)

for item in ${FILES[*]}
do
  CURRENT_HASH="$CURRENT_HASH$(sha1sum $item)"
done

if [ "$OLD_HASH" == "$CURRENT_HASH" ]; then
  echo "Regular start"
else
  docker-compose down
  echo "Build start"
  docker-compose build --parallel #--no-cache --pull
  echo "$CURRENT_HASH" > $HASH_FILE
fi

docker-compose up
