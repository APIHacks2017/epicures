require 'json'

rests = JSON.parse(File.read('scripts_and_data/reviews_with_sentiments.json'))

rests.map do |rest|
  reviews = rest['reviews']

  reviews.map do |review|
    review['datetime'] = Time.at(review['timestamp']).strftime("%Y-%m-%d") unless review['timestamp'].nil?
  end
end

puts rests.to_json