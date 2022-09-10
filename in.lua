eval[[
debug=false
json = require("dkjson")
 
 
function command(str)
log("cmd:"..str)
executeCommand(str)
end
 
k=0
function log(data)
  if debug then
    local file = io.open("/sdcard/脚本/log.txt", "r+")
    if file then
        datar = file:read("*a")
        file:close()
    else
        datar=""
    end
    local file1 = io.open("/sdcard/脚本/log.txt", "w+")
    file1:write(datar.."log:"..data.."\n")
    file1:close()
    clientMessage("log:"..data.."\n")
  end
end
 
function findpos(name,x1,x2,tx1,tx2)
  log("x1:"..x1.." x2:"..x2)
  log(6)
  if x1-x2<3 and x1-x2>-3 then
    log(10)
    if c6==1 then
      x=x1
      c6=c6+1
      clientMessage("§e正在查找y坐标...")
      findpos(c1,-40,1000,c2,c3)
    elseif c6==2 then
      y=x1
      c6=c6+1
      clientMessage("§e正在查找z坐标...")
      findpos(c1,c3,c3+30000000,c2,c3)
    else
      z=x1
      find=3
      clientMessage("§e成功找到玩家,坐标x："..x.."y："..y.."z："..z)
      executeCommand("/ww tp "..math.ceil(x).." "..math.ceil(y).." "..math.ceil(z))
      exit()
    end
    return nil
  end
  log(7)
  if x1>x2 then
    local temp=x1
    local x1=x2
    local x2=temp
  end
 
  if c6==1 then
    cmd=string.format('/w @s @a[x=%d,y=-40,z=%d,dx=%d,dy=1040,dz=30000000,name=%s]',x1,tx2,math.ceil((x2-x1)/2),name)
  elseif c6==2 then
    cmd=string.format('/w @s @a[x=%d,y=%d,z=%d,dx=30000000,dy=%d,dz=30000000,name=%s]',tx1,x1,tx2,math.ceil((x2-x1)/2),name)
  elseif c6==3 then
    cmd=string.format('/w @s @a[z=%d,y=-40,x=%d,dz=%d,dy=1040,dx=30000000,name=%s]',x1,tx1,math.ceil((x2-x1)/2),name)
  end
  c4=x1
  c5=x2
  log(8)
  command(cmd)
end
 
 
function findplayer(name)
  log(2)
    if ty<4 then
    ty=ty+1
  else
    clientMessage("§4玩家不在查找范围内")
    find=3
    exit()
    return nil
  end
  log(3)
  if ty%2==0 then
    tx1=-30000000
  else
    tx1=0
  end
  if ty<3 then
    tx2=-30000000
  else
    tx2=0
  end
  local cmd=string.format('/w @s @a[x=%d,y=-40,z=%d,dx=30000000,dy=1040,dz=30000000,name=%s]',tx1,tx2,name)
  log(4)
  c1=name
  c2=tx1
  c3=tx2
  command(cmd)
end
 
function onCommandOutputEvent(type,args,value)
if debug then
log("v:"..value)
log("args")
    log('输出类型:' .. type..'  输出值:' .. value)
    for i = 1, #args do
        log(i..' type:' .. args[i].type..'  key:' .. args[i].key)
        local array = args[i].list;
        for j = 1, #array do
            log('内容:' .. array[j])
        end
    end
log("argsend")
end
if value==0 then
clientMessage("§4选择器权限不足，请联系房主打开作弊后使用")
end
if args[1].list[2]==c1 then
value=1
else
value=0
end
log("n:"..args[1].list[2])
log("v:"..value)
if find==1 and value==1 then
log(5)
find=2
c6=1
clientMessage("§e正在查找x坐标...")
findpos(c1,c2,c2+30000000,c2,c3)
elseif find==2 then
  log(9)
  if value==1 then
    findpos(c1,c4,math.ceil((c5-c4)/2)+c4,c2,c3)
  else
    findpos(c1,math.ceil((c5-c4)/2)+c4,c5,c2,c3)
  end
elseif find==1 then
  findplayer(c1)
end
end
 
function find()
list = getWorldPlayerList()
local menu = {
        type = 'form',
        title = '共有'..#list.."名玩家",
        content = '请选择需要传送的玩家',
        buttons = { { text = '暂无数据' } }
    }
    length = #list
    if list and length > 0 then
        for i = 1, length do
            local entityId = list[i].id
            if entityId ~= nil then
                mid2=getEntityPos(entityId)
                if (mid2.x==0 and mid2.y==0 and mid2.z==0) or debug then
                    jsonz=list[i].name.."  [坐标]需要查找"
                    list[i].find=true
                else
                    jsonz=list[i].name..",[坐标]X:"..math.ceil(mid2.x).." Y:"..math.ceil(mid2.y-3).." Z:"..math.ceil(mid2.z)
                    list[i].find=false
                end
                menu.buttons[i] = { text = jsonz }
            end
        end
    end
    addForm(json.encode(menu, {}), function(index)
        if index >= 0 then
            if list[index+1].find then
                find=1   
                log(1)
                ty=0
                findplayer(list[index+1].name)
            else
                mid2=getEntityPos(list[index+1].id)
                executeCommand("/ww tp "..math.ceil(mid2.x).." "..math.ceil(mid2.y-3).." "..math.ceil(mid2.z))
            end
        else
            exit()
        end
end)
end
log(666)
find()
]]