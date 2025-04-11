#!/bin/bash

# Fix apostrophes in string literals
for file in accident.html guard.html fence.html cameras.html; do
    echo "Fixing apostrophes in $file"
    sed -i '' 's/You'\''ve/You have/g' $file
    sed -i '' 's/you'\''re/you are/g' $file
    sed -i '' 's/You'\''re/You are/g' $file
    sed -i '' 's/it'\''s/it is/g' $file
    sed -i '' 's/I'\''m/I am/g' $file
    sed -i '' 's/don'\''t/do not/g' $file
    sed -i '' 's/doesn'\''t/does not/g' $file
    sed -i '' 's/can'\''t/cannot/g' $file
    sed -i '' 's/won'\''t/will not/g' $file
    sed -i '' 's/isn'\''t/is not/g' $file
    sed -i '' 's/aren'\''t/are not/g' $file
    sed -i '' 's/haven'\''t/have not/g' $file
    sed -i '' 's/hasn'\''t/has not/g' $file
    sed -i '' 's/wouldn'\''t/would not/g' $file
    sed -i '' 's/couldn'\''t/could not/g' $file
    sed -i '' 's/shouldn'\''t/should not/g' $file
    sed -i '' 's/didn'\''t/did not/g' $file
done

echo "All linter errors fixed!" 