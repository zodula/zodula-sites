# Hero Section Layout DSL

# Nodes
tagline tagline-0 at (416, 9.25)
codeBlock codeBlock-0 at (364, 162)
command command-0 at (406, -96)
feature feature-0 at (346.75, 728)
feature feature-1 at (344, 870)
feature feature-2 at (660.25, 928)
feature feature-3 at (344.5, 984)
feature feature-4 at (670, 796)

# Connections
# Syntax: connect sourceId -> targetId [fromHandle] [toHandle]
# Example: connect codeBlock-0 -> command-0 bottom left
connect command-0 -> feature-0 right left
connect command-0 -> feature-1 right left
connect command-0 -> feature-2 right left
connect command-0 -> feature-3 right left
connect command-0 -> feature-4 right left
connect codeBlock-0 -> feature-0 bottom right
connect codeBlock-0 -> feature-4 bottom left
connect codeBlock-0 -> feature-1 bottom right
connect codeBlock-0 -> feature-2 bottom left
connect codeBlock-0 -> feature-3 bottom right

# To remove a connection, delete the line above
# To add a connection, add a new line with: connect sourceId -> targetId [fromHandle] [toHandle]