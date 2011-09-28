require 'sinatra'
require 'erb'
require 'json'

set :public, File.dirname(__FILE__) + '/public'

get '/' do
  images = get_images.values
  erb :index, :locals => {images: images}
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

  id = images.length
  image[:id] = id
  images[id] = image

  content_type :json
  image.to_json
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
