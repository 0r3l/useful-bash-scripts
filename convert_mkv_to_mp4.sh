#!/bin/bash

# Ensure FFmpeg is installed
if ! command -v ffmpeg &> /dev/null
then
    echo "FFmpeg could not be found, please install it first."
    exit 1
fi

# Check if target directory is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <target-directory>"
    exit 1
fi

# Directory containing MKV files
DIR="$1"

# Check if the directory exists
if [ ! -d "$DIR" ]; then
    echo "The directory $DIR does not exist."
    exit 1
fi

# Loop through all MKV files in the directory
for file in "$DIR"/*.mkv; do
    # Check if there are no MKV files in the directory
    if [ "$file" == "$DIR/*.mkv" ]; then
        echo "No MKV files found in the directory $DIR."
        exit 1
    fi

    # Get the base name of the file (without extension)
    base_name=$(basename "$file" .mkv)
    
    # Construct the output file name
    output_file="$DIR/$base_name.mp4"
    
    # Convert MKV to MP4 using FFmpeg without re-encoding
    ffmpeg -i "$file" -codec copy "$output_file"
    
    # Check if the conversion was successful
    if [ $? -eq 0 ]; then
        echo "Successfully converted $file to $output_file"
    else
        echo "Failed to convert $file"
    fi
done

echo "Conversion process completed."
