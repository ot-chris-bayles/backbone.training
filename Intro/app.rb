require 'sinatra'
require 'sinatra/content_for'
require 'erb'
require 'json'
require 'sinatra/reloader' if development?

set :public, File.dirname(__FILE__) + '/public'

get '/' do
  erb :index
end

get '/add' do
  images = get_images.values
  erb :"add-image", :locals => {
    :images => images, 
    :image_template => image_template
  }
end

post '/add' do
  # create
  images = get_images

  image = {
    url: params["url"],
    name: params["name"],
    description: params["description"]
  }

  id = images.keys.max+1
  image[:id] = id
  images[id] = image

  redirect "/images/#{image[:id]}"
end

get '/edit/:id' do
  images = get_images.values
  id = params[:id].to_i
  image = images[id]

  erb :"edit-image", :locals => {
    :images => images, 
    :image => image, 
    :image_id => id,
    :image_template => image_template
  }
end

post '/edit/:id' do
  # edit
  images = get_images
  id = params[:id].to_i

  image = images[id]
  image[:name] = params["name"]
  image[:description] = params["description"]

  redirect "/images/#{image[:id]}"
end

get '/delete/:id' do
  images = get_images
  id = params[:id].to_i
  images.delete(id)

  redirect "/"
end

get '/images' do
  images = get_images.values
  puts images.inspect
  content_type :json
  images.to_json
end

post '/images' do
  # create
  images = get_images

  image_data = JSON.parse(request.body.read.to_s)
  image = {
    url: image_data["url"],
    name: image_data["name"],
    description: image_data["description"]
  }

  id = images.keys.max+1
  image[:id] = id
  images[id] = image

  content_type :json
  image.to_json
end

get '/images/:id' do
  images = get_images.values
  id = params[:id].to_i
  image = images[id]

  nextId = image[:id] + 1
  nextId = 0 if nextId >= images.length
  image[:nextId] = nextId

  prevId = image[:id] - 1
  prevId = images.length - 1 if prevId < 0
  image[:prevId] = prevId

  erb :image, :locals => {
    :images => images, 
    :image => image, 
    :image_id => id,
    :image_template => image_template
  }
end

put '/images/:id' do
  # update
  id = params[:id].to_i

  images = get_images
  image = images[id]

  image_data = JSON.parse(request.body.read.to_s)
  image[:url] = image_data["url"]
  image[:name] = image_data["name"]
  image[:description] = image_data["description"]

  content_type :json
  image.to_json
end

post '/images/:id/comments' do
  # update
  id = params[:id].to_i

  images = get_images
  image = images[id]

  comment_data = JSON.parse(request.body.read.to_s)
  comment = {:comment => comment_data["comment"]}

  image[:comments] = [] unless image[:comments]
  image[:comments].push(comment)

  content_type :json
  comment.to_json
end

delete '/images/:id' do
  #delete
  id = params[:id].to_i

  images = get_images
  images.delete(id)

  content_type :json
  {}.to_json
end

def get_images
  return settings.images if settings.respond_to?(:images)

  images = {};
  images[0] = {
    id: 0,
    url: "/images/tools.jpeg",
    name: "a rusty wrench",
    description: "a close up of an old, rusty wrench",
    comments: [
      {id: 0, comment: "i love the colors on this wrench! and the texture really makes it stand out. nicely done!"}
    ]
  }
  images[1] = {
    id: 1,
    url: "/images/island.jpeg",
    name: "a drop of water",
    description: "with a purple flower behind it"
  }
  images[2] = {
    id: 2,
    url: "/images/mountain.jpeg",
    name: "a tree and a mountain",
    description: "with some clouds about the mountain"
  }
  images[3] = {
    id: 3,
    url: "/images/tree.jpeg",
    name: "some islands",
    description: "in the sunset"
  }

  set :images, images
  return images
end

def image_template
  {
    id: "${id}",
    url: "${url}",
    name: "${name}",
    description: "${description}"
  }
end
