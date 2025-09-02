#!/bin/bash

# Create sounds directory if it doesn't exist
mkdir -p /workspaces/Remind-Candles/public/sounds

# Download sound files from freesound.org (Creative Commons licensed sounds)
# Soft Chime
curl -L "https://freesound.org/data/previews/264/264447_3263906-lq.mp3" -o /workspaces/Remind-Candles/public/sounds/soft-chime.mp3

# Birthday Tune (already have this one)
# mv /workspaces/Remind-Candles/public/sounds/birthday-notification.mp3 /workspaces/Remind-Candles/public/sounds/birthday-tune.mp3

# Loud Alert
curl -L "https://freesound.org/data/previews/250/250629_4486188-lq.mp3" -o /workspaces/Remind-Candles/public/sounds/loud-alert.mp3
